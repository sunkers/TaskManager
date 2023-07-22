// fonctions pour le calendrier
function getDayOfYear(date) {
    var start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
}


function formatTime(date) {
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    hours = hours < 10 ? '0' + hours : hours;  
    minutes = minutes < 10 ? '0' + minutes : minutes;  
    return hours + ':' + minutes;
}

export function getDateString(date) {
    var today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
    var currentDay = getDayOfYear(today);
    var taskDay = getDayOfYear(date);
    var taskHour = formatTime(date);
    var differenceInDays = taskDay - currentDay;

    if (differenceInDays === 0) {
        return 'Today' + (taskHour !== "00:00" ? ", " + taskHour : "");
    } else if (differenceInDays === 1) {
        return 'Tomorrow' + (taskHour !== "00:00" ? ", " + taskHour : "");
    } else if (differenceInDays < 7 && differenceInDays > 0) {
        return date.toLocaleDateString('en-US', { weekday: 'long' }) + (taskHour !== "00:00" ? ", " + taskHour : "");
    } else if (differenceInDays < 0) {
        return date.getUTCDate().toString().padStart(2, '0') + "-" + (date.getUTCMonth() + 1).toString().padStart(2, '0') + (taskHour !== "00:00" ? " at " + taskHour : "");
    } else {
        return 'Due to ' + date.getUTCDate().toString().padStart(2, '0') + "-" + (date.getUTCMonth() + 1).toString().padStart(2, '0') + (taskHour !== "00:00" ? " at " + taskHour : "");
    }
}
