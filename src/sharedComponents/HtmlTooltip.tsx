import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses, type TooltipProps } from '@mui/material/Tooltip'

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--mui-palette-background-default)',
    border: '2px solid var(--mui-palette-background-paper)'
  }
}))

export default HtmlTooltip
