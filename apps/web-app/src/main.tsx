import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'

import 'rsuite/dist/rsuite.min.css';
import './styles/styles.css'
import { MainApp } from './app';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <StrictMode>
        <MainApp />
    </StrictMode>
)
