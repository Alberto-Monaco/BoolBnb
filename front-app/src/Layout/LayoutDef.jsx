import { Outlet } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
export default function LayoutDef() {
	return (
		<>
			<AppHeader />
			<main>
				<Outlet />
			</main>
			<AppFooter />
		</>
	)
}
