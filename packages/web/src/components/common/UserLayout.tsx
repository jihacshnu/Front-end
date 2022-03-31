import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import AuthRequired from './AuthRequired';
import AppBar from './AppBar';
import BottomBar from './BottomBar';
import Container from './Container';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: `${theme.palette.background.default} !important`,
  minHeight: '100vh !important',
}));

interface IProps {
  children: ReactNode;
  authRequired?: boolean;
  mustAdmin?: boolean;
  container?: boolean;
}

const UserLayout = ({
  children,
  authRequired = false,
  mustAdmin = false,
  container = true,
}: IProps): any => {
  const authenticated = useSelector(({ auth }: any) => auth.authenticated);
  return (
    <StyledPaper elevation={0}>
      <AppBar />
      <Container maxWidth={container ? 'lg' : false}>
        {authRequired ? <AuthRequired mustAdmin={mustAdmin}>{children}</AuthRequired> : children}
      </Container>
      {authenticated && <BottomBar />}
    </StyledPaper>
  );
};

export default UserLayout;
