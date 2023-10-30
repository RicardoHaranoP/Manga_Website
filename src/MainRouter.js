import { useEffect } from "react";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Manga from "./pages/Manga";
import Search from "./pages/Search";
import MangaOverview from "./pages/MangaOverview";
import MangaChapter from "./pages/MangaChapter";
import MangaChapters from "./pages/MangaChapters";
import Recommendations from "./pages/Recommendations";
import { useLocation, Routes, Route } from "react-router-dom"

function MainRouter() {
    const location = useLocation()

    useEffect(() => {
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant", // Optional if you want to skip the scrolling animation
        });
    }, [location.pathname]);

    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/manga/:id/chapter/:chapterId" element={<MangaChapter />} />
                <Route path="/manga/:id" element={<Manga />}>
                    <Route path="/manga/:id/overview" element={<MangaOverview />} />
                    <Route path="/manga/:id/chapters" element={<MangaChapters />} />
                    <Route path="/manga/:id/recommendations" element={<Recommendations />} />
                </Route>
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    );
}

export default MainRouter;
