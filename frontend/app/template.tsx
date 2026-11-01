// A template re-mounts on every navigation, so the page fades/slides in each time.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter flex flex-col flex-grow">{children}</div>;
}