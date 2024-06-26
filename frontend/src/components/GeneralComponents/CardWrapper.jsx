import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const StyledCard = styled(Card)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  minHeight: "100px",
  padding: "12px"
});

const CardWrapper = (props) => {
  return(
    <StyledCard className={props.class}>
      {props.children}
    </StyledCard>
  )
}

export default CardWrapper;