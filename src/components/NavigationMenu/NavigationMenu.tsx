import React from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const NavigationWrapper = styled.nav`
  position: relative;
  z-index: 1000;
  height: 42px;
  position: sticky;
  top: 0;
  background-color: #333;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 0 8px;
`

const MenuList = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const MenuButton = styled.button`
  padding: 6px 12px;
  background: none;
  border: 1px solid #555;
  color: white;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s ease;
  min-width: 60px;

  &:hover,
  &:focus {
    background-color: #444;
    border-color: #666;
    outline: none;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }

  @media (min-width: 480px) {
    padding: 8px 16px;
    font-size: 15px;
    min-width: 70px;
  }
`

interface MenuItem {
  label: string
  path: string
}

const menuItems: MenuItem[] = [
  { label: 'Home', path: '' },
  { label: 'Explore', path: 'explore' },
]

export const NavigationMenuRaw: React.FC = () => {
  const navigate = useNavigate()

  const handleMenuItemClick = React.useCallback(
    (path: string) => {
      navigate('/' + path)
    },
    [navigate],
  )

  return (
    <NavigationWrapper>
      <MenuList>
        {menuItems.map((item, index) => (
          <MenuButton
            key={`${item.label}-${index}`}
            onClick={() => handleMenuItemClick(item.path)}
          >
            {item.label}
          </MenuButton>
        ))}
      </MenuList>
    </NavigationWrapper>
  )
}

export const NavigationMenu = React.memo(NavigationMenuRaw)
