
import {AppBar , Toolbar, styled} from '@mui/material';
import { blue } from '@mui/material/colors';

const Container = styled(AppBar)`
background :#060606;
height:64px;
`

const Header =() =>{

    const logo ='https://img.freepik.com/free-vector/creative-gradient-code-logo_23-2148820572.jpg?t=st=1731226552~exp=1731230152~hmac=377c8adb8d1c50a187dee6343c1457e96f76ea28a767874e83cfbe53c364326b&w=740'
     return (
        <Container position='static'>
            <Toolbar>
                <img src={logo} alt="logo" style ={{width:50}}/>
                <h1>DEVSTUDIO</h1>
            </Toolbar>
        </Container>

     )
}

export default Header;