const Skeleton = () => {
    return (
        <div className="fixed inset-0 z-50 bg-dark overflow-hidden flex flex-col pt-8 px-4 w-full h-full pointer-events-none">
            {/* Navbar Skeleton */}
            <div className="flex justify-center w-full mb-32 opacity-60">
                <div className="w-[300px] md:w-[500px] h-[56px] rounded-[32px] animate-shimmer shadow-2xl" />
            </div>

            {/* Hero Skeleton Layout */}
            <div className="flex flex-col items-center justify-center w-full max-w-[1400px] mx-auto flex-1 pb-32 opacity-60">
                {/* Title Skeletons */}
                <div className="w-[80vw] md:w-[600px] h-[60px] md:h-[120px] rounded-3xl animate-shimmer mb-6" />
                <div className="w-[60vw] md:w-[400px] h-[30px] md:h-[40px] rounded-2xl animate-shimmer mb-10" />

                {/* CTA Buttons Skeletons */}
                <div className="flex gap-4 mb-20">
                    <div className="w-[140px] h-[50px] rounded-full animate-shimmer" />
                    <div className="w-[140px] h-[50px] rounded-full animate-shimmer" />
                </div>

                {/* Sub-grid Skeletons */}
                <div className="w-full justify-center gap-6 px-4 hidden md:flex">
                    <div className="w-1/3 max-w-[300px] h-[100px] rounded-2xl animate-shimmer" />
                    <div className="w-1/3 max-w-[300px] h-[100px] rounded-2xl animate-shimmer" />
                </div>
            </div>
        </div>
    )
}

export default Skeleton
