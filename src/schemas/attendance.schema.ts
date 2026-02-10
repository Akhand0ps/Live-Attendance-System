import * as z from 'zod'


export const attendanceZod = z.object({
    event:z.string(),
    data:z.object({
        studentId:z.string(),
        status:z.string()
    })
})