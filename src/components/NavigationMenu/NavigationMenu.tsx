import { memo, useState } from 'react'

import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const BurgerWrapper = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  margin-left: auto;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;
`

const Line = styled.div`
  width: 100%;
  height: 3px;
  background-color: white;
`

const Menu = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  top: 70px;
  right: 0;
  width: 100%;
  background-color: #333;
  z-index: 1;
  padding: 8px 0;
`

const MenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid #f1f1f133;
  }
`

const menuItems = [
  { label: 'Home', path: '' },
  { label: 'Explore', path: 'explore' },
  { label: 'Contact', path: 'contact' },
]
export const NavigationMenuRaw = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <BurgerWrapper onClick={() => setOpen(!open)}>
        <Line />
        <Line />
        <Line />
      </BurgerWrapper>
      <Menu open={open}>
        {menuItems.map((item, _idx) => (
          <MenuItem
            key={item.label + '_' + _idx}
            onClick={() => {
              navigate('/' + item.path)
              setOpen(false)
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export const NavigationMenu = memo(NavigationMenuRaw)
