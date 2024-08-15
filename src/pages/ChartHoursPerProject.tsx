import db from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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
            durationMS: projectDurations[project.id] || 0
        }))
    }, [start, end])

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title">
                    <Label value="Hours" offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis>
                    <Label value="Project" offset={-5} position="insideBottom" />
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default ChartHoursPerProject
