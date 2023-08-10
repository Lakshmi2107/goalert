
export const getUrlParams = (params) => {
    let inputArr = params.split("?")
    let outputArr = {}
    if(inputArr.length > 1) {
        inputArr = inputArr[1].split('&')
        inputArr.forEach((input) => {
            const data = input.split("=")
            outputArr[data[0]] = data[1]
        })
    }
    return outputArr
}

export const getPathParams = (params) => {
    let inputArr = params.split("/")
    let outputArr = []
    inputArr.forEach((input, key) => {
        outputArr.push(input)
    })
    return outputArr
}

export const getMaxAttrColumn = (rowData, eliminateColumns) => {
    let columnDef = []
    if(rowData.length > 0) {
        columnDef = Object.keys(rowData[0])
        let findIndex = 0
        let maxCount = columnDef.length
        rowData.map((opt, key) => {
            maxCount = (key === 0) ? Object.keys(opt).length : maxCount
            if(Object.keys(opt).length >= maxCount) {
                findIndex = key
                maxCount = Object.keys(opt).length
            }
        })
        columnDef = Object.keys(rowData[findIndex])
    }

    const retValue = []
    columnDef.map((opt) => {
        if(eliminateColumns.indexOf(opt) === -1) {
            retValue.push(opt)
        }
    })
    return retValue
}

export const camelToTitle = (inputStr) => {
    var result = inputStr.replace( /([A-Z])/g, " $1" );
    var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult
}


export const getHeaderName = (obj) => {
    let inputArr = obj.split("_")
    let outputStr = ""
    inputArr.forEach((input) => {
        outputStr += capitalizeFirstLetter(input)+" "
    })
    return outputStr
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getFullDate = (date) => {
    var months_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var days_arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    var SpecificDay = days_arr[date.getDay()];
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var fulldate = SpecificDay+', '+month+' '+day+', '+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return fulldate;
}

export const convertUTCDateToLocalDate = (date) => {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return getFullDate(newDate)   
}

export const convertStampDate = (timestamp) => {
    // Months array
    var months_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var days_arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    var date = new Date(timestamp);
    //let isoString = date.toISOString();
    /*var date = convertUTCDateToLocalDate(new Date(checkDate))
    var SpecificDay = days_arr[date.getDay()];
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var fulldate = SpecificDay+', '+month+' '+day+', '+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return fulldate; */
    return getFullDate(date)
}

export const convertDBDate = (date) => {
    date = new Date(date.toUTCString());
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    return year+"-"+month+"-"+day+"T"+hours+":"+minutes+":"+seconds.substr(-2)+".000-0000"
}

export const currentDateTimeStamp = () => {
    const today = new Date()
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    let day = today.getDate();
    month = month < 10 ? "0"+month : month
    day = day < 10 ? "0"+day : day
    const retDate = year+"-"+month+"-"+day+"T00:00"
    return retDate
}

export const convertToTitle = (str) => {
    const convertedStr =  str.replace(
        /^[a-z]|^([A-Z]+)(?=[A-Z]|$)|([A-Z])+(?=[A-Z]|$)|([A-Z])(?=[a-z]+)/g,
        m => " " + m.toUpperCase()
      ).trim().replace("  "," ")
    return convertedStr
}



    