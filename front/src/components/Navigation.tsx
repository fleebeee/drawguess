import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const paths = [
  { pathname: '/', label: 'Home' },
  { pathname: '/game', label: 'Game' },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <Container>
      {paths.map((path) => (
        <NavButton key={path.pathname}>
          <StyledLink
            to={path.pathname}
            // activecolor={path.pathname === location.pathname}
          >
            {path.label}
          </StyledLink>
        </NavButton>
      ))}
    </Container>
  );
};

const Container = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  min-width: var(--sidebar-width);

  background-color: var(--main-700);
`;

const NavButton = styled.li`
  text-align: center;
  width: 100%;
  margin-top: 40px;
`;

const StyledLink = styled(Link)`
  color: ${(props) =>
    props.activecolor ? 'var(--secondary-300)' : 'var(--white)'};
`;

export default Navigation;
