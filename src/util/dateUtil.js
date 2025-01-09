class DateUtil {

  formatDate(date) {
    if(this.isToday(date)) {
      return `오늘 ${date.toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})}`;
    }
    if(this.isYesterday(date)) {
      return `어제`;
    }
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  isToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return today.getDate() === compareDate.getDate();
  }

  isYesterday(date) {
    const today = new Date();
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    return date.getDate() === yesterday.getDate()
        && date.getMonth() === yesterday.getMonth()
        && date.getFullYear() === yesterday.getFullYear();
  }

}

export default DateUtil