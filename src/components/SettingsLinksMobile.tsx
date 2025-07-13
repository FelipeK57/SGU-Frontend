import { Link } from "react-router"

interface SettingsLinksMobileProps {
    paths: any[]
    setShowLinks: (showLinks: boolean) => void;
}

export const SettingsLinksMobile = ({ paths, setShowLinks }: SettingsLinksMobileProps) => {
    return <div className="flex sm:hidden flex-col gap-3 border-1 border-zinc-200 rounded-lg p-5">
        {
            paths.map((path) => {
                return <Link className="flex justify-between items-center w-full p-3 rounded-lg hover:text-primary hover:bg-primary hover:bg-opacity-5 transition-all" onClick={() => setShowLinks(false)} key={path.path} to={path.path}>{path.name} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg></Link>
            })
        }
    </div>
}