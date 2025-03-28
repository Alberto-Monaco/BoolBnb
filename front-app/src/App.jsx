import React from 'react'
import { Routes, Route, BrowserRouter, Form } from 'react-router-dom'
import LayoutDef from './Layout/LayoutDef.jsx'
import Homepage from './pages/Homepage.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import AddPropertiesPage from './pages/AddPropertiesPage.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import { GlobalContextProvider } from './Context/GlobalContext.jsx'
import LogInPage from './pages/LogInPage.jsx'
import RegistrationPage from './pages/RegistrationPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import FinderPage from './pages/FinderPage.jsx'

function App() {
	return (
		<>
			<GlobalContextProvider>
				<BrowserRouter>
					<Routes>
						<Route element={<LayoutDef />}>
							<Route index element={<Homepage />} />
							<Route path="/properties/:slug" element={<DetailsPage />} />
							<Route path="/add/properties/:owner" element={<AddPropertiesPage />} />
							<Route path="/search" element={<SearchPage />} />
							<Route path='/search/finder' element={<FinderPage />} />
							<Route path="/about" element={<About />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/login" element={<LogInPage />} />
							<Route path="/registration" element={<RegistrationPage />} />
							<Route path="*" element={<h1>Not Found</h1>} />
						</Route>
					</Routes>
				</BrowserRouter>
			</GlobalContextProvider>
		</>
	)
}

export default App
