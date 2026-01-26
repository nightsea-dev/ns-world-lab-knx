import { PrefixProperties } from "@ns-lab-klx/types"
import { Header, HeaderProps } from "../header"
import { Footer } from "../footer"
import { _cn } from "../../../utils"
import { MainProps } from "../main"


// ======================================== props
export type PageProps =
    & Partial<
        & HeaderProps

        & PrefixProperties<Pick<MainProps, "className">, "main_">
        & Pick<MainProps, "children">
    >

// ======================================== component
export const Page = ({
    title
    , user
    , main_className
    , children
}: PageProps

) => {
    return (
        <div
            className="flex flex-col h-screen"
        >
            <Header
                title={title}
                user={user}
            // title={APP_NAME}
            />
            <main className={_cn(
                "flex-1 overflow-hidden"
                , main_className
            )}>
                {children}
                {/* <Board /> */}
            </main>
            <Footer />
        </div>
    )
}