import {loadScripts} from "@wangct/util";
import {message} from 'antd';
import {aryToObject} from "@wangct/util";
import {toStr,toAry} from "@wangct/util";

/**
 * 导出票价
 * @param data
 * @param columns
 * @param lineOptions
 */
export async function doExportPrice({data,columns,lineOptions}){
  const XLSX = await getXLSX();
  const borderStyle = getPriceBorderStyle();
  const sheetData = {};
  const lineColorTemp = aryToObject(lineColorOptions,'value',(item) => item.color);
  const priceColorTemp = aryToObject(priceColorOptions,'value',(item) => item.color);
  let lineCount = 2;
  let maxCellKey = 'A1';
  lineOptions.forEach((lineOpt) => {
    const key = getCellKey(lineCount,0);
    const rowKey = getCellKey(0,lineCount);
    const bgColor = lineColorTemp[formatLineId(lineOpt.line_id)];
    const style = {
      border: borderStyle,
      fill: {
        bgColor: {
          rgb: '000000'
        },
        fgColor: {
          rgb: bgColor && bgColor.substr(1) || 'ffffff',
        },
      },
      font:{
        color:{
          rgb: 'ffffff',
        },
        sz:'16',
      },
      alignment:{
        vertical:'center',
        horizontal:'center',
        wrapText:true,
      }
    };
    sheetData[key] = {
      v:lineOpt.line_name || '',
      s:style,
    };
    sheetData[rowKey] = {
      v:lineOpt.line_name || '',
      s:style,
    };
    lineCount += lineOpt.count;
  });
  columns.forEach((col,index) => {
    const key = getCellKey(index ? index + 1 : index,index ? 1 : 0);
    const bgColor = lineColorTemp[formatLineId(col.line_id)];

    sheetData[key] = {
      v:col.title || '',
      s: {
        border: borderStyle,
        font:{
          color:{
            rgb: index ? 'ffffff' : '000000',
          },
          sz:'16',
        },
        fill: {
          bgColor: {
            rgb: '000000'
          },
          fgColor: {
            rgb: bgColor && bgColor.substr(1) || 'ffffff',
          },
        },
        alignment:{
          vertical:index ? 'top' : 'center',
          horizontal:index ? 'top' : 'center',
          wrapText:true,
        },
      },
    };
  });

  data.forEach((item,rowIndex) => {
    columns.forEach((colItem,colIndex) => {
      const {render} = colItem;
      const cellKey = getCellKey(colIndex + 1,rowIndex + 2);
      const isStationName = colItem.dataIndex === 'station_id';
      const fieldValue = item[colItem.dataIndex] || '';
      const value = render ? render(fieldValue,item) : fieldValue;
      const bgColor = isStationName ? lineColorTemp[formatLineId(item.line_id)] : priceColorTemp[value];
      sheetData[cellKey] = {
        v:value + '',
        s: {
          border: borderStyle,
          fill: {
            bgColor: {
              rgb:'000000',
            },
            fgColor: {
              rgb: bgColor && bgColor.substr(1) || 'ffffff',
            },
          },
          font:{
            color:{
              rgb: isStationName ? 'ffffff' : '000000',
            },
            sz:isStationName ? '16' : '12',
          },
          alignment:{
            horizontal:!!colIndex ? 'center' : 'top',
            vertical:!!colIndex ? 'center' : 'top',
          }
        },
      };
      maxCellKey = cellKey;
    });
  });

  const wb = {
    SheetNames: ['mySheet'], //保存的表标题
    Sheets: {
      'mySheet': {
        ...sheetData,
        '!ref': 'A1:' + maxCellKey, //设置填充区域
        '!cols':new Array(columns.length + 1).fill(true).map((item,index) => {
          let wpx = 20;
          if(!index){
            wpx = 60;
          }else if(index === 1){d
            wpx = 200;
          }
          return {
            wpx,
          };
        }),
        // '!freeze': {
        //   xSplit: "2",
        //   ySplit: "2",
        //   topLeftCell: "B2",
        //   activePane: "bottomRight",
        //   state: "frozen"
        // },
        '!merges':[
          {
            s: { c: 0, r: 0 },
            e: { c: 1, r: 1 },
          },
          ...getLineMerges(lineOptions),
        ],
      },
    }
  };
  const targetBlob = new Blob([s2ab(XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary',
    cellStyles: true
  }))]);
  downloadBlob(targetBlob,'票价列表.xlsx');
}

function getLineMerges(lineOptions){
  let count = 2;
  const list = [];
  lineOptions.forEach((opt) => {
    list.push({
      s:{
        c:count,
        r:0,
      },
      e:{
        c:count + opt.count - 1,
        r:0,
      },
    });

    list.push({
      s:{
        c:0,
        r:count,
      },
      e:{
        c:0,
        r:count + opt.count - 1,
      },
    });

    count += opt.count;
  });
  return list;
}

//xlsx数据导出  https://github.com/SheetJS/js-xlsx
export async function exportJson(data,options = {}){
  const XLSX = await getXLSX();
  data = toAry(data);
  const sheetData = {};
  // @ts-ignore
  const {header = [],filename} = options;
  header.forEach((title,index) => {
    const key = getCellKey(index,0);
    sheetData[key] = {
      v:title,
    };
  });
  let maxCellKey = 'A1';
  toAry(data).forEach((item,rowIndex) => {
    header.forEach((key,colIndex) => {
      const cellKey = getCellKey(colIndex,rowIndex + 1);
      sheetData[cellKey] = {
        v:toStr(item[key]),
      };
      maxCellKey = cellKey;
    });
  });
  const wb = { SheetNames: ['Sheet1'], Sheets: {
      Sheet1:{
        ...sheetData,
        '!ref': 'A1:' + maxCellKey, //设置填充区域
      }
    }, Props: {} };

  const targetBlob = new Blob([s2ab(XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary',
    cellStyles: true
  }))]);
  downloadBlob(targetBlob,filename);
}

async function getXLSX(){
  // @ts-ignore
  const {XLSX} = window;
  return XLSX ? XLSX : loadXLSX();
}

function loadXLSX(){
  const check = () => {
    // @ts-ignore
    const {XLSX} = window;
    if(XLSX){
      return XLSX;
    }
    message.warn('加载插件XLSX失败');
    return Promise.reject('加载插件XLSX失败');
  };
  // return loadScripts('http://192.168.193.64:8080/index/externals/xlsx.js').then(check).catch(check);
  return loadScripts('/indexAssets/externals/xlsx/xlsx.core.min.js').then(check).catch(check);
}


function getCellKey(colIndex,rowIndex){
  return (colIndex > 25 ? getCharCol(colIndex) : String.fromCharCode(65 + colIndex)) + (rowIndex + 1);
}

// 获取26个英文字母用来表示excel的列
function getCharCol(n) {
  let s = '';
  let m = 0;
  while (n > 0) {
    m = n % 26 + 1;
    s = String.fromCharCode(m + 64) + s;
    n = (n - m) / 26
  }
  return s
}

function s2ab(s) {
  if (typeof ArrayBuffer !== 'undefined') {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } else {
    var buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}

export function downloadBlob(obj, fileName = '导出文件.xlsx') {
  const target = document.createElement("a");
  target.download = fileName;
  target.href = URL.createObjectURL(obj);
  target.click();
}


const priceColorOptions = [
  {
    value:'2',
    color:'#e26343',
  },
  {
    value:'3',
    color:'#d226db',
  },
  {
    value:'4',
    color:'#2db09f',
  },
  {
    value:'5',
    color:'#a35790',
  },
  {
    value:'6',
    color:'#bea035',
  },
  {
    value:'7',
    color:'#88c7d1',
  },
  {
    value:'8',
    color:'#9ec42e',
  },
  {
    value:'9',
    color:'#e9af20',
  },
  {
    value:'10',
    color:'#305a9d',
  },
];

const lineColorOptions = [
  {
    value:'01',
    color:'#3c2d7b',
  },
  {
    value:'02',
    color:'#e25f43',
  },
  {
    value:'03',
    color:'#d2266d',
  },
  {
    value:'04',
    color:'#2db09f',
  },
  {
    value:'05',
    color:'#a35790',
  },
  {
    value:'07',
    color:'#88c7d1',
  },
  {
    value:'10',
    color:'#305a9d',
  },
];

function getPriceBorderStyle(){
  const borderStyle = {
    style:'thin',
    color:{
      rgb:'000000',
    },
  };
  return {left:borderStyle,top:borderStyle,right:borderStyle,bottom:borderStyle};
}

function formatLineId(id){
  return toStr(id).padStart(2,'0');
}
