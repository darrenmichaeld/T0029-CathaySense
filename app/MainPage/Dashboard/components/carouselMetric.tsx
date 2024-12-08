import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const newsItems = [
    {
      date: "14 Oct 2024",
      title: "Singapore to build second airport logistics park to boost cargo capacity",
      content: "From the 2030s, Singapore will develop a second logistics park at Changi Airport to expand the capacity. This will increase Changi Airport's overall cargo handling capacity from 3 million tonnes per year currently to 5.4 million tonnes per year, said Minister for Trade and Industry Gan Kim Yong on Thursday (Oct 3).",
    },
    {
      date: "15 Oct 2024",
      title: "New AI-powered cargo tracking system launched at major airports",
      content: "A revolutionary AI-powered tracking system has been implemented across major international airports, promising to reduce cargo processing times by up to 40%. The system uses advanced machine learning algorithms to optimize routing and handling procedures.",
    },
    {
      date: "16 Oct 2024",
      title: "Global air cargo demand shows strong recovery in Q4",
      content: "Latest industry reports indicate a significant uptick in global air cargo demand for Q4 2024. The increase is attributed to growing e-commerce activities and the recovery of manufacturing sectors across Asia and Europe.",
    },
  ]

export default function CarouselMetric(){
        // Carousel
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length)
    }
    return(
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Latest News</CardTitle>
            </CardHeader>
            <CardContent className="relative">
            <div className="overflow-hidden">
                <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                {newsItems.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                    <Card>
                        <CardContent className="flex flex-col gap-4 p-6">
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                            <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                            <p className="text-muted-foreground">{item.content}</p>
                            <div className="flex justify-between items-center">
                                <button className="text-sm text-primary hover:underline">
                                    Read more
                                </button>
                            </div>
                        </CardContent>
            </Card>
            </div>
        ))}
        </div>
    </div>
    <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
    >
        <ChevronLeft className="h-6 w-6" />
    </button>
    <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
    >
        <ChevronRight className="h-6 w-6" />
    </button>
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {newsItems.map((_, index) => (
        <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
            index === currentIndex ? "bg-primary w-4" : "bg-neutral-300"
            }`}
            onClick={() => setCurrentIndex(index)}
        />
        ))}
    </div>
    </CardContent>
    </Card>
    )
}