import { Box, Typography, css } from '@mui/material'
import ButtonWrapper from './ButtonWrapper'

interface EmptyStateDisplayProps {
  message: string
  callToActionButton?: JSX.Element
}

const EmptyStateDisplay = ({ message, callToActionButton }: EmptyStateDisplayProps) => {
  return (
    <Box css={wrapperCSS}>
      <Typography variant="body1">
        {message}
      </Typography>
      {callToActionButton ? <ButtonWrapper>{callToActionButton}</ButtonWrapper> : ''}
    </Box>
  )
}

const wrapperCSS = css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;

    button {
        margin-bottom: 1rem;
    }

`

export default EmptyStateDisplay
