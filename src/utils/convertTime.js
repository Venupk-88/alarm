export const timeTo12 = (time) => {  
    if (time == undefined || time == "") return "00";
    return addingZero(time > 12 ? time % 12 : time);
}

export const addingZero = (ti) => Number(ti) < 10 ? "0" + Number(ti) : ti;

export const isTimeType = (hour) => hour >= 12 ? "PM" : "AM";
