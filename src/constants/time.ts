export const dayHoursArray = Array.from({ length: 24 }, (_, i) => {
    return {
        value: String(i),
        label: String(i).padStart(2, '0') + ':00',
    }
});
