import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import neuron from "../assets/neuron.png";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState(null);
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});
		return () => unsubscribe();
	}, [auth]);

	return (
		<nav className="p-4 bg-black text-white">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex items-center">
					<img className="h-8" src={neuron} alt="Logo" />
					<Link to="/" className="ml-2 text-xl font-bold text-purple-500">
						Veracity.AI
					</Link>
				</div>

				<button
					className="md:hidden text-purple-500"
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? <X size={28} /> : <Menu size={28} />}
				</button>

				<div className="hidden md:flex space-x-4 items-center gap-5">
					{user ? (
						<>
							<Link to="/home" className="hover:text-purple-400 transition-colors ease-in">
								Analyse
							</Link>
							<Link to="/dashboard" className="hover:text-purple-400 transition-colors ease-in">
								Dashboard
							</Link>
							<Link to="/devtools" className="hover:text-purple-400 transition-colors ease-in">
								Devtools
							</Link>
							<Link to="/pricing" className="hover:text-purple-400 transition-colors ease-in">
								Pricing
							</Link>
							<Link to={"/"}>
								<button
									onClick={() => signOut(auth)}
									className="border px-4 py-2 rounded-lg hover:bg-purple-500 hover:border-black transition-colors ease-in"
								>
									Logout
								</button>
							</Link>
						</>
					) : (
						<>
							<Link className="hover:text-purple-400 transition-colors ease-in">
								Features
							</Link>
							<Link className="hover:text-purple-400 transition-colors ease-in">
								About
							</Link>
							<Link to="/signup">
								<button className="bg-purple-500 hover:bg-purple-400 transition-colors ease-in px-4 py-2 rounded-lg">
									Sign Up
								</button>
							</Link>
							<Link to="/login">
								<button className="border px-4 py-2 rounded-lg hover:bg-purple-500 hover:border-black transition-colors ease-in">
									Login
								</button>
							</Link>
						</>
					)}
				</div>
			</div>

			{isOpen && (
				<div className="md:hidden flex flex-col items-center space-y-4 mt-4">
					{user ? (
						<>
							<Link to="/home" className="hover:text-purple-400 transition-colors ease-in">
								Analyse
							</Link>
							<Link to="/dashboard" className="hover:text-purple-400 transition-colors ease-in">
								Dashboard
							</Link>
							<Link to="/devtools" className="hover:text-purple-400 transition-colors ease-in">
								Devtools
							</Link>
							<Link to="/pricing" className="hover:text-purple-400 transition-colors ease-in">
								Pricing
							</Link>
							<Link to={"/"}>
								<button
									onClick={() => signOut(auth)}
									className="border px-4 py-2 rounded-lg w-full"
								>
									Logout
								</button>
							</Link>
						</>
					) : (
						<>
							<Link>Features</Link>
							<Link>About</Link>
							<Link to="/signup">
								<button className="bg-purple-500 px-4 py-2 rounded-lg w-full">
									Sign Up
								</button>
							</Link>
							<Link to="/login">
								<button className="border px-4 py-2 rounded-lg w-full">
									Login
								</button>
							</Link>
						</>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
