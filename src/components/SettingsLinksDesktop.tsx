import { Link, useLocation } from "react-router"

interface SettingsLinksDesktopProps {
    paths: any[]
}

export const SettingsLinksDesktop = ({ paths }: SettingsLinksDesktopProps) => {

    const location = useLocation().pathname;

    const isActive = (url: string) => {
        if (location.includes(url)) {
            return "bg-primary bg-opacity-5 text-primary"
        }
        else {
            return "text-zinc-500"
        }
    }

    return <div className="hidden sm:flex sm:flex-col gap-3 h-fit border-1 border-zinc-200 rounded-lg p-5">
        {
            paths.map((path) => {
                return <Link className={`p-3 rounded-lg ${isActive(path.path)} hover:text-primary hover:bg-primary hover:bg-opacity-5 transition-all`} key={path.path} to={path.path}>{path.name}</Link>
            })
        }
    </div>
}