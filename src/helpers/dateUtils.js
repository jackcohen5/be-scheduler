export const getNowPlusMinutes = offsetMinutes => {
    const t = new Date()
    t.setMinutes(t.getMinutes() + offsetMinutes)
    return t
}

const ISO_DATE_REGEX = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/

const validateDateFormat = d => ISO_DATE_REGEX.test(d)

export const validateDate = d =>
    validateDateFormat(d) && new Date(d).getTime() > new Date().getTime()
