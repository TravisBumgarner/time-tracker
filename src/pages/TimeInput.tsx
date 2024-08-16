import TrashIcon from '@mui/icons-material/Delete'
import TimerIcon from '@mui/icons-material/Timer'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import { Box, css, FormControl, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, type SelectChangeEvent } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useContext, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { context } from 'Context'
import db from 'database'
import { ModalID } from 'modals'
import moment, { type Moment } from 'moment'
import { EmptyStateDisplay } from 'sharedComponents'
import { EProjectStatus, type TProject, type TProjectEntry } from 'types'
import { formatDateKeyLookup, formatDurationDisplayString } from 'utilities'

const TimeInput = () => {
    const { dispatch } = useContext(context)
    const startTime = useRef<Moment | null>(null)
    const [timerRunning, setTimerRunning] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState('')
    const [newProjectTitle, setNewProjectTitle] = useState('')
    const [percentFocus, setPercentFocus] = useState(100)
    const [details, setDetails] = useState('')

    const handleProjectChange = useCallback((event: SelectChangeEvent) => {
        setSelectedProjectId(event.target.value)
    }, [])

    const projects: Record<string, TProject> | undefined = useLiveQuery(async () => {
        const projectsArray = await db.projects.toArray()
        const projectsById = projectsArray.reduce<Record<string, TProject>>((acc, project) => {
            acc[project.id] = project
            return acc
        }, {})
        return projectsById
    })

    const projectEntries = useLiveQuery(async () => {
        return await db.projectEntries.orderBy('start').reverse().limit(8).toArray()
    })

    const addProject = useCallback(async () => {
        if (!newProjectTitle) throw Error('Something went wrong')

        const newProject = {
            id: uuidv4(),
            title: newProjectTitle,
            status: EProjectStatus.ACTIVE
        }

        await db.projects.add(newProject)
        return newProject
    }, [newProjectTitle])

    const startTimer = useCallback(() => {
        startTime.current = moment()
        setTimerRunning(true)
    }, [])

    const triggerDeleteModal = useCallback((id: string) => {
        dispatch({
            type: 'SET_ACTIVE_MODAL',
            payload: {
                id: ModalID.CONFIRMATION_MODAL,
                title: 'Delete Entry?',
                confirmationColor: 'warning',
                confirmationText: 'Delete',
                confirmationCallback: () => {
                    void db.projectEntries.where('id').equals(id).delete()
                }
            }
        })
    }, [dispatch])

    const cancelTimer = useCallback(() => {
        startTime.current = null
        setTimerRunning(false)
        setSelectedProjectId('')
        setNewProjectTitle('')
        setPercentFocus(100)
        setDetails('')
    }, [])

    const endTimer = useCallback(async () => {
        if (!startTime.current) return
        setTimerRunning(false)
        let projectId = selectedProjectId
        if (newProjectTitle.length > 0) {
            projectId = (await addProject()).id
        }

        const newEntry: TProjectEntry = {
            start: formatDateKeyLookup(startTime.current),
            end: formatDateKeyLookup(moment()),
            id: uuidv4(),
            projectId,
            details
        }

        await db.projectEntries.add(newEntry)

        startTime.current = null
        setSelectedProjectId('')
        setNewProjectTitle('')
        setPercentFocus(100)
        setDetails('')
    }, [startTime, selectedProjectId, newProjectTitle, addProject, details])

    return (
        <Box css={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
            <div>
                {
                    timerRunning
                        ? (
                            <Box css={endTimerContainerCSS}>
                                <IconButton color="warning" aria-label="delete" onClick={cancelTimer}>
                                    <TrashIcon />
                                </IconButton>
                                <TextField
                                    label="% Focus"
                                    onChange={(e) => { setPercentFocus(parseInt(e.target.value)) }}
                                    value={percentFocus}
                                    type="number"
                                    size="small"
                                    css={{ width: '80px' }}
                                />
                                <TextField
                                    label="Details"
                                    onChange={(e) => { setDetails(e.target.value) }}
                                    value={details}
                                    size="small"
                                    css={{ flexGrow: 1, marginLeft: '16px' }}
                                />

                                <IconButton color="primary" aria-label="delete" onClick={endTimer}>
                                    <TimerOffIcon />
                                </IconButton>
                            </Box>
                        )
                        : (
                            (
                                <Box css={setupTimerContainerCSS}>
                                    <div>
                                        <FormControl fullWidth css={selectProjectContainerCSS}>
                                            <Select
                                                displayEmpty
                                                size="small"
                                                labelId="selected-project-id"
                                                value={selectedProjectId}
                                                onChange={handleProjectChange}
                                            >
                                                <MenuItem value="">Add New</MenuItem>
                                                {projects && Object.values(projects).map((project) => (
                                                    <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {selectedProjectId === '' && (
                                            <FormControl sx={{ marginLeft: '16px' }}>
                                                <TextField size="small" placeholder="New Project" value={newProjectTitle} onChange={(e) => { setNewProjectTitle(e.target.value) }} />
                                            </FormControl>
                                        )}
                                    </div>
                                    <IconButton color='primary' disabled={!selectedProjectId && !newProjectTitle} aria-label="start" onClick={startTimer}>
                                        <TimerIcon />
                                    </IconButton>
                                </Box>

                            )
                        )
                }
            </div>
            {(!projects || !projectEntries || projectEntries.length === 0)
                ? < EmptyStateDisplay message="Time to get started!" />
                : (
                    <Box css={tableContainerCSS}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Start</TableCell>
                                    <TableCell>Project</TableCell>
                                    <TableCell>Details</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projectEntries?.map((entry) => {
                                    const start = moment(entry.start)
                                    const end = moment(entry.end)
                                    const duration = moment.duration(end.diff(start))

                                    return (
                                        < TableRow key={entry.id} >
                                            <TableCell>{entry.start}</TableCell>
                                            <TableCell>{projects[entry.projectId]?.title || 'Title not found'}</TableCell>
                                            <TableCell>{entry.details}</TableCell>
                                            <TableCell>{formatDurationDisplayString(duration.asMilliseconds())}</TableCell>
                                            <TableCell>
                                                <IconButton css={{ padding: 0 }} aria-label="delete" onClick={() => { triggerDeleteModal(entry.id) }}>
                                                    <TrashIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                )
            }
        </Box >
    )
}

const tableContainerCSS = css`
    overflow: auto;
    flex-grow: 1;
    margin-top: 16px;
    height: 0; // Magic CSS to make this all work with vertical scroll.
    table {
        border-collapse: collapse;
    }
    th, td {
        padding: 2px 4px; // Reduce padding for a denser look
        font-size: 10px; // Smaller font size
        line-height: 1;
    }
    th {
        font-weight: bold;
    }
`

const selectProjectContainerCSS = css`
    width: 170px;
`

const setupTimerContainerCSS = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const endTimerContainerCSS = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export default TimeInput
