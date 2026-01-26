import { UsersTable } from '../components/UsersTable'
import { ClockWrapper, Page } from '@ns-lab-klx/ui'
import { createUser } from "@ns-lab-klx/logic"

const APP_NAME = '@ns-lab-klx/admin'

export function App() {
    return (
        <Page
            title={APP_NAME}
            user={createUser()}
        >
            <ClockWrapper />
            <UsersTable />
        </Page>
    )
}

{/* <div>
    <Header title={APP_NAME} />
    <MainComponent>
        <ClockWrapper />
        <UsersTable />
    </MainComponent>
    <Footer />
</div> */}