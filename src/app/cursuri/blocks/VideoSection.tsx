import ConsentGate from "@/components/blocks/cookie-consent/ConsentGate";
import { COOKIE_CATEGORIES } from "@/components/blocks/cookie-consent/config";
import { cn } from "@/utils/cn";
import React from "react";

const VideoSection: React.FC = () => {
  return (
    <section className={cn("py-20", "bg-gray-50")}>
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col gap-10 items-center">
          <div className="text-center flex flex-col gap-3 max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Ne vedem pe gheață
            </p>
            <h2 className="text-4xl font-semibold text-gray-900">
              Cum arată cursurile noastre
            </h2>
            <p className="text-gray-500 font-light leading-relaxed">
              O privire în lumea patinajului EduSport - energie, progres și
              multă distracție pe gheață.
            </p>
          </div>

          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-xl">
            <ConsentGate category={COOKIE_CATEGORIES.functionality} label="YouTube">
            <iframe
              // youtube-nocookie, not youtube.com: the plain domain sets four
              // tracking cookies (VISITOR_INFO1_LIVE, YSC and friends) on load,
              // which would contradict the cookie policy and require consent.
              src="https://www.youtube-nocookie.com/embed/G-0eleYxj2w"
              title="Cursuri de patinaj EduSport"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
            </ConsentGate>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
