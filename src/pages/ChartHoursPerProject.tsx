import db from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { type TDateISODate, type TProject, type TProjectEntry } from 'types'

interface Props {
    start: TDateISODate
    end: TDateISODate
}

const ChartHoursPerProject: React.FC<Props> = ({ start, end }) => {
    const data = useLiveQuery(async () => {
        const entries: TProjectEntry[] = await db.projectEntries.where('date').between(start, end, true, true).toArray()

        const projectDurations = entries.reduce<Record<string, number>>((acc, entry) => {
            if (!acc[entry.projectId]) {
                acc[entry.projectId] = 0
            }
            acc[entry.projectId] += entry.durationMS
            return acc
        }, {})

        const projects: TProject[] = await db.projects.where('id').anyOf(Object.keys(projectDurations)).toArray()

        // Combine project titles with durations
        return projects.map(project => ({
            title: project.title,
            durationHours: (projectDurations[project.id] || 0) / 1000 / 60 / 60
        }))
    }, [start, end])
    return (
        <ResponsiveContainer width="90%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title">
                </XAxis>
                <YAxis dataKey="durationHours">
                </YAxis>
                <Tooltip />
                <Bar dataKey="durationHours" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default ChartHoursPerProject
