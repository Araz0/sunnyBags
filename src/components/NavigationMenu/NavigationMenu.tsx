import React from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const NavigationWrapper = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  @media (min-width: 768px) {
    padding: 0 40px;
  }
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  
  img { height: 35px; width: auto; }
  span { font-weight: 800; font-size: 1.25rem; color: #1a1a1a; }
`

const MenuList = styled.div`
  display: none;
  gap: 32px;
  align-items: center;

  @media (min-width: 768px) {
    display: flex;
  }
`

const Hamburger = styled.button`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;

  @media (min-width: 768px) {
    display: none;
  }

  span {
    width: 25px;
    height: 2px;
    background: #333;
    transition: 0.3s;
  }
`

const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  gap: 30px;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
`

const MenuLink = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
`

const menuItems = [
  { label: 'Home', path: '' },
  { label: 'Explore', path: 'explore' },
]

export const NavigationMenuRaw: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate('/' + path);
    setIsOpen(false);
  }

  return (
    <NavigationWrapper>
      <LogoContainer onClick={() => navigate('/')}>
        <img src="/logo.png" alt="Logo" />
        <span>SunnyBags</span>
      </LogoContainer>

      <MenuList>
        {menuItems.map((item) => (
          <MenuLink key={item.label} onClick={() => handleNavigate(item.path)}>{item.label}</MenuLink>
        ))}
      </MenuList>

      <Hamburger onClick={() => setIsOpen(!isOpen)}>
        <span /> <span /> <span />
      </Hamburger>

      <MobileMenu isOpen={isOpen}>
        {menuItems.map((item) => (
          <MenuLink key={item.label} onClick={() => handleNavigate(item.path)}>{item.label}</MenuLink>
        ))}
      </MobileMenu>
    </NavigationWrapper>
  )
}

export const NavigationMenu = React.memo(NavigationMenuRaw)