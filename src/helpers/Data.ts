import moment from "moment";

export const formatPhone = (phone: string) => {
    if (!phone || phone === 'null') return '';
    return `250${phone?.slice(-9)}`;
}

export const formatDate = (date: string | Date) => {
    if (!date) return '';
    return moment(date).format('DD/MM/YYYY');
};

export const capitalizeString = (string: string) => {
    if (!string) return '';
    const words = string.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
};
