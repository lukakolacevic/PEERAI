import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type NavbarProps = {
  cards: { title: string; value: string | number; description?: string }[];
};

export const Navbar: React.FC<NavbarProps> = ({ cards }) => {
  return (
    <div>
       <div className="mb-8 pl-6">
  <img
    src="/logo.png"  // or wherever your image is located
    width={180} // Set width (pixels)
  height={90} // Set height (pixels)
   
  />
</div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="p-6 border border-[#E4E5E1] bg-white rounded-[10px]"
          >
            <CardHeader>
              {/* Title */}
              <CardTitle className="text-lg font-normal text-black mb-2">
                {card.title}
              </CardTitle>
              <div className="flex items-start">
                {/* Value */}
                <CardDescription className="text-6xl font-bold text-orange-600">
                  {card.value}
                </CardDescription>
                {/* Description */}
                {card.description && (
                  <div className="text-lg font-bold text-black mb-2 ml-12 mt-7">
                    {card.description}
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
