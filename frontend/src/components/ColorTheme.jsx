import { useContext } from 'react'

// icons
import { MdOutlineWbSunny } from 'react-icons/md';
import { IoMoon } from 'react-icons/io5';

// contexts
import { ThemeContext } from '../Contexts/ThemeContext';

const ColorTheme = () => {

  const { theme, setTheme } = useContext(ThemeContext)

  const theme_toggle = () => {
    const bodyEl = document.querySelector('body');
    if (theme === 'light') {
      setTheme('dark')
      bodyEl.style.backgroundImage = 'url("src/assets/pattern__seamless__06__dark.png")'
      bodyEl.classList.remove('light')
      bodyEl.classList.add('dark')
    } else {
      setTheme('light')
      bodyEl.style.backgroundImage = 'url("src/assets/pattern__seamless__06.png")'
      bodyEl.classList.remove('dark')
      bodyEl.classList.add('light')
    }
  }

  return (
    <article className={`color-theme ${theme === 'light' ? 'light' : 'dark'}`}>
      <div className='color-theme__wrapper'>
        <h4 className='sr-only'>Toggle color button</h4>
        <button
          className='color-theme__button'
          onClick={() => theme_toggle()}
        >
          {
            theme === 'light'
              ?
              <MdOutlineWbSunny className='icon' />
              :
              <IoMoon className='icon' />
          }
        </button>
      </div>
    </article>
  )
}

export default ColorTheme