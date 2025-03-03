import React from 'react'

function TopNavbar() {
    return (<>
        <div className="border-b border-gray-200 bg-gray-50 text-slate-700">
            <div className="flex items-center justify-between px-4 py-3 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-3">
                <div className="text-center text-lg-start">
                    <div className="flex items-center">
                        <a href="https://wa.me/250787279560" rel="noopener" target="__blank" className="text-decoration-none text-body font-patua font-bold flex items-center text-sm">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6.94 20.63C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l4.94-1.37Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M17 15.17c0 .18-.04.37-.13.55a2.279 2.279 0 0 1-1.16 1.1c-.3.13-.63.19-.98.19-.51 0-1.06-.12-1.63-.37-.58-.25-1.15-.58-1.72-.99-.58-.42-1.12-.89-1.64-1.4-.52-.52-.98-1.07-1.4-1.64-.41-.57-.74-1.14-.98-1.71C7.12 10.33 7 9.78 7 9.26c0-.34.06-.67.18-.97.12-.31.31-.59.58-.84.32-.32.67-.47 1.04-.47.14 0 .28.03.41.09.13.06.25.15.34.28l1.16 1.64c.09.13.16.24.2.35.05.11.07.21.07.31 0 .12-.04.24-.11.36s-.16.24-.28.36l-.38.4c-.06.06-.08.12-.08.2 0 .04.01.08.02.12.02.04.03.07.04.1.09.17.25.38.47.64a13.48 13.48 0 0 0 1.53 1.53c.26.22.48.37.65.46.03.01.06.03.09.04.04.02.08.02.13.02.09 0 .15-.03.21-.09l.38-.38c.13-.13.25-.22.36-.28.12-.07.23-.11.36-.11.1 0 .2.02.31.07.11.05.23.11.35.2l1.66 1.18c.13.09.22.2.28.32 0 .12.03.24.03.38Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10"></path></svg></div>
                            <span className='ml-2'>+250 787 279 560</span>
                        </a>
                        <span className="text-body top-header-about-links ml-2">|</span>
                        <a className="text-decoration-none text-body px-3 font-patua font-bold flex items-center text-sm" rel="noopener" target="__blank" href="mailto:info@vitaway.org">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                            <span className='ml-2'>info@vitaway.org</span>
                        </a>
                        <span className="text-body top-header-about-links">|</span>
                        <a href="{{ route('about') }}" className="text-decoration-none top-header-about-links text-body px-3 font-patua font-bold flex items-center text-sm">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 2H8C4 2 2 4 2 8v13c0 .55.45 1 1 1h13c4 0 6-2 6-6V8c0-4-2-6-6-6Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M7 9.5h10M7 14.5h7" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                            <span className='ml-2'>About Us</span>
                        </a>
                        <span className="text-body top-header-about-links">|</span>
                        <a href="{{ route('get.team') }}" className="text-decoration-none top-header-about-links text-body px-3 font-patua font-bold flex items-center text-sm">
                            <div className='border border-gray-200 rounded-xl p-[5px]'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9.159 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43c0-2.45 1.98-4.44 4.44-4.44a4.435 4.435 0 0 1 .16 8.87Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M16.411 4c1.94 0 3.5 1.57 3.5 3.5 0 1.89-1.5 3.43-3.37 3.5a1.13 1.13 0 0 0-.26 0" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4.159 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M18.34 20c.72-.15 1.4-.44 1.96-.87 1.56-1.17 1.56-3.1 0-4.27-.55-.42-1.22-.7-1.93-.86" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                            <span className='ml-2'>Our team</span>
                        </a>
                        <span className="text-body top-header-about-links">|</span>
                        <a href="{{ route('faqs') }}" className="text-decoration-none top-header-about-links text-body px-3 font-patua font-bold flex items-center text-sm">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 18.43h-4l-4.45 2.96A.997.997 0 0 1 7 20.56v-2.13c-3 0-5-2-5-5v-6c0-3 2-5 5-5h10c3 0 5 2 5 5v6c0 3-2 5-5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M12 11.36v-.21c0-.68.42-1.04.84-1.33.41-.28.82-.64.82-1.3 0-.92-.74-1.66-1.66-1.66-.92 0-1.66.74-1.66 1.66M11.995 13.75h.01" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                            <span className='ml-2'>FAQs</span>
                        </a>
                    </div>
                </div>
                <div className="col-md-6 text-center text-lg-end top-header-social-links">
                    <div className="flex items-center">
                        <a className="text-body px-2" rel="noopener" target="__blank" href="https://www.facebook.com/VitawayEClinic/">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity=".4" d="M14 9.3v2.95h2.63c.19 0 .33.17.29.36l-.38 1.9c-.03.14-.15.24-.29.24H14V22h-3v-7.25H9.3c-.17 0-.3-.13-.3-.3v-1.9c0-.17.13-.3.3-.3H11V9c0-1.66 1.34-3 3-3h2.7c.17 0 .3.13.3.3v2.4c0 .17-.13.3-.3.3h-2.4c-.17 0-.3.13-.3.3Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"></path><path d="M15 22H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h6c5 0 7 2 7 7v6c0 5-2 7-7 7Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                        </a>
                        <a className="text-body px-2" rel="noopener" target="__blank" href="https://x.com/Vitawayeclinic/">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5.46 2H4.05c-.93 0-1.4 1.13-.74 1.79l5.73 5.73a4.189 4.189 0 0 0 5.93 0l5.73-5.73c.66-.66.19-1.79-.74-1.79h-1.41c-.83 0-1.63.33-2.22.92L12.75 6.5c-.41.41-1.07.41-1.48 0L7.69 2.92C7.09 2.33 6.29 2 5.46 2Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M5.46 21.969H4.05c-.93 0-1.4-1.13-.74-1.79l5.73-5.73a4.189 4.189 0 0 1 5.93 0l5.73 5.73c.66.66.19 1.79-.74 1.79h-1.41c-.83 0-1.63-.33-2.22-.92l-3.58-3.58c-.41-.41-1.07-.41-1.48 0l-3.58 3.58c-.6.59-1.4.92-2.23.92Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                        </a>
                        <a className="text-body px-2" rel="noopener" target="__blank" href="https://www.linkedin.com/in/emmanuel-hakuzimana-123309188/?originalSubdomain=rw">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M15.75 9h-7.5M15.75 15h-7.5" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                        </a>
                        <a className="text-body px-2" rel="noopener" target="__blank" href="https://www.instagram.com/vitawayeclinic/">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".34" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".34" d="M17.636 7h.012" stroke="#697689" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                        </a>
                        <a className="text-body ps-2 mr-3" rel="noopener" target="__blank" href="https://www.youtube.com/@vitawaye-clinic6903">
                            <div className='border border-gray-200 rounded-xl p-[5px]'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 20H7c-3 0-5-2-5-5V9c0-3 2-5 5-5h10c3 0 5 2 5 5v6c0 3-2 5-5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="m11.42 9.49 2.47 1.48c.94.57.94 1.49 0 2.06l-2.47 1.48c-1 .6-1.82.14-1.82-1.03v-2.97c0-1.16.82-1.62 1.82-1.02Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                        </a>

                        <span className="text-body top-header-about-links">|</span>

                        <form action="{{ route('locale') }}" method="POST" id="localeForm">
                            <div className="flex items-center mx-2 text-sm">
                                <span className="font-patua font-medium">Eng</span>
                                <label className="relative inline-flex cursor-pointer items-center mx-2">
                                    <input id="switch-3" name="locale" type="checkbox" className="peer sr-only" />

                                    <label className="hidden"></label>

                                    <div className="peer h-4 w-11 rounded border bg-slate-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#3268b9] peer-checked:after:translate-x-full peer-focus:ring-green-300">
                                    </div>
                                </label>
                                <span className="font-patua font-medium">Kiny</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default TopNavbar