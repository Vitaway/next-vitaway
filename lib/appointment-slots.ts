const START_HOUR = 8;
const END_HOUR = 20;
const MIN_NOTICE_MS = 60 * 60 * 1000;

export function localDateISO(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function slotDateTime(date: string, time: string) {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    const slot = new Date(`${date}T00:00:00`);
    slot.setHours(hours, minutes, 0, 0);
    return slot;
}

export function isSlotBookable(date: string, time: string) {
    const slot = slotDateTime(date, time);
    if (!slot) return false;
    return slot.getTime() >= Date.now() + MIN_NOTICE_MS;
}

export function buildTimeSlots(appointmentDate: string) {
    const slots: string[] = [];
    if (!appointmentDate) return slots;

    for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
        for (const min of [0, 30]) {
            if (hour === END_HOUR && min > 0) continue;
            const value = `${String(hour).padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
            if (isSlotBookable(appointmentDate, value)) slots.push(value);
        }
    }
    return slots;
}

export function earliestBookableDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (buildTimeSlots(localDateISO()).length > 0) return today;
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}
