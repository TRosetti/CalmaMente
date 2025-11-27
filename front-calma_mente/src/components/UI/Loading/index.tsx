export default function Loading(){
    return(
        <div className="flex-col gap-4 w-full flex items-center justify-center" style={{height: "100vh", position: "absolute", backgroundColor: "#00000082", zIndex: "1000", backdropFilter: "blur(4px)"}}>
            <div className="w-20 h-20 border-4 border-transparent text-violet-600 text-4xl animate-spin flex items-center justify-center border-t-violet-600 rounded-full" >
                <div className="w-16 h-16 border-4 border-transparent text-violet-400 text-2xl animate-spin flex items-center justify-center border-t-violet-400 rounded-full"></div>
            </div>
        </div>

    )
}