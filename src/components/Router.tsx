import { context } from 'Context'
import { useContext, useMemo } from 'react'
import { EActivePage } from 'types'
import { Error, TimeTracker } from '../pages'

const Router = () => {
  const { state: { activePage } } = useContext(context)
  const page = useMemo(() => {
    switch (activePage) {
      case EActivePage.Home:
        return <TimeTracker />
      default:
        return <Error />
    }
  }, [activePage])

  return page
}

export default Router
