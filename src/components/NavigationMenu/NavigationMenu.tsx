import React from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const NavigationWrapper = styled.nav`
  position: relative;
  z-index: 1000;
  width: 100%;
  height: 42px;
  position: sticky;
  top: 0;
  background-color: #333;
  align-items: center;
  justify-content: end;
  display: flex;
`

const BurgerButton = styled.button<{ isOpen: boolean }>`
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  z-index: 1001;

  &:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  span {
    width: 100%;
    height: 3px;
    background-color: white;
    transition: all 0.3s ease;
    transform-origin: center;

    &:nth-of-type(1) {
      transform: ${({ isOpen }) => isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
    }

    &:nth-of-type(2) {
      opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
    }

    &:nth-of-type(3) {
      transform: ${({ isOpen }) => isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'};
    }
  }
`

const MenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ isOpen }) => isOpen ? '1' : '0'};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 999;
`

const MenuPanel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: min(300px, 80vw);
  height: 100vh;
  background-color: #333;
  transform: translateX(${({ isOpen }) => isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  z-index: 1000;
  padding-top: 60px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
`

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const MenuItem = styled.li`
  border-bottom: 1px solid #f1f1f133;

  &:last-child {
    border-bottom: none;
  }
`

const MenuLink = styled.button`
  width: 100%;
  padding: 16px 24px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus {
    background-color: #444;
    outline: none;
  }

  &:focus {
    background-color: #555;
  }
`

interface MenuItem {
  label: string
  path: string
}

const menuItems: MenuItem[] = [
  { label: 'Home', path: '' },
  { label: 'Explore', path: 'explore' },
  { label: 'Contact', path: 'contact' },
]

export const NavigationMenuRaw: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<Boolean>(false)
  const navigate = useNavigate()
  const menuRef = React.useRef<HTMLDivElement>(null)

  const closeMenu = React.useCallback(() => setIsOpen(false), [])
  const toggleMenu = React.useCallback(() => setIsOpen((prev: boolean) => !prev), [])

  const handleMenuItemClick = React.useCallback((path: string) => {
    navigate('/' + path)
    closeMenu()
  }, [navigate, closeMenu])

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeMenu()
    }
  }, [closeMenu])

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeMenu])

  return (
    <NavigationWrapper>
      <BurgerButton
        isOpen={isOpen}
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="navigation-menu"
      >
        <span />
        <span />
        <span />
      </BurgerButton>

      <MenuOverlay isOpen={isOpen} onClick={closeMenu} />
      
      <MenuPanel 
        ref={menuRef}
        isOpen={isOpen}
        id="navigation-menu"
        role="menu"
        aria-hidden={!isOpen}
      >
        <MenuList>
          {menuItems.map((item, index) => (
            <MenuItem key={`${item.label}-${index}`} role="none">
              <MenuLink
                onClick={() => handleMenuItemClick(item.path)}
                onKeyDown={handleKeyDown}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
              >
                {item.label}
              </MenuLink>
            </MenuItem>
          ))}
        </MenuList>
      </MenuPanel>
    </NavigationWrapper>
  )
}

export const NavigationMenu = React.memo(NavigationMenuRaw)
