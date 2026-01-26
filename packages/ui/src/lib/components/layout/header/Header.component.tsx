import { _memo, Avatar } from '@ns-lab-klx/ui'
import { ReactNode, useState } from 'react'
import { HasTitle, User } from "@ns-lab-klx/types"

// ======================================== props
export type HeaderProps =
    & Partial<
        & HasTitle<ReactNode>
        & {
            user: User
        }
    >

// ======================================== components
/**
 * * [domain] aware
 */
export const Header = ({
    title
    , user
}: HeaderProps
) => {

    // const [user] = useState<User>(() => {
    //     return {
    //         uuid: faker.string.uuid(),
    //         name: faker.person.fullName(),
    //         email: faker.internet.email(),
    //         job: faker.person.jobTitle(),
    //     }
    // })

    return (
        <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
                {title}
            </div>
            {user && (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        {user.name}
                    </span>
                    <Avatar
                        src={`https://i.pravatar.cc/150?u=${user.uuid}`}
                    />
                </div>)
            }
        </header>
    )
}
