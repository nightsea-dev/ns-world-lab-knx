import {
    Header
    , Footer,
    Page
} from '@ns-lab-klx/ui'
import {
    Board
} from './Board'
import { createUser } from "@ns-lab-klx/logic"


const APP_NAME = "@ns-lab-klx/board"

export function App() {
    return (
        <Page
            title={APP_NAME}
            user={createUser()}
        >
            <Board />
        </Page>
    )
}

{/* <div className="flex flex-col h-screen">
    <Header
        title={APP_NAME}
    />
    <main className="flex-1 overflow-hidden">
        <Board />
    </main>
    <Footer />
</div> */}