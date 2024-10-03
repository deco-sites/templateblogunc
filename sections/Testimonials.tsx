// import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../components/ui/Icon.tsx";
import Slider from "../components/ui/Slider/index.tsx";
import { useId } from "../sdk/useId.ts";
import { BlogPost } from "apps/blog/types.ts";

export interface CTA {
  text?: string;
}

export interface Props {
  cta?: CTA;
  posts?: BlogPost[] | null;
  /**
   * @title Show arrows
   * @description show arrows to navigate through the images
   */
  arrows?: boolean;
  /**
   * @title Show dots
   * @description show dots to navigate through the images
   */
  dots?: boolean;
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function SliderItem(
  { post, id }: { post: BlogPost; id: string },
) {
  const {
    title,
    excerpt,
    authors,
    image,
    date,
    slug,
  } = post;

  return (
    <a
      href={`/blog/${slug}`}
      id={id}
      class="relative overflow-y-hidden w-full min-h-[292px]"
    >
      <div class="flex flex-col h-full w-full bg-white">
        {image && (
          <Image
            class="object-cover w-full "
            alt={title}
            src={image}
            width={320}
            height={179}
          />
        )}
        {post.categories && (
          <div class="flex flex-wrap  mt-2  px-5 gap-2 mb-2">
            {post.categories?.map((category) => (
              <div
                class="rounded-badge border border-secondary px-4 py-1 text-xs bg-[#EAEAEB] text-primary font-bold"
                key={category.slug}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
        <h3 class="text-lg font-bold px-5 mb-2">{title}</h3>
        <p class="text-sm text-gray-500 px-5 mb-2">{excerpt}</p>
        <div class="flex items-center gap-3 px-5">
          {authors?.[0]?.avatar && (
            <Image
              class="object-cover w-12 h-12 rounded-full"
              alt={authors[0].name}
              src={authors[0].avatar}
              width={48}
              height={48}
            />
          )}
          <div class="flex flex-col">
            <p class="text-base font-semibold">{authors?.[0]?.name}</p>
            <p class="text-sm text-gray-400 mb-5">
              {date
                ? new Date(date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
                : ""}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

function Dots({ posts, interval = 0 }: Props) {
  // Defina quantos posts são visíveis por vez (por exemplo, 4)
  const visiblePosts = 4;

  // Calcule quantos "grupos" de posts você tem
  const numOfDots = Math.ceil((posts?.length || 0) / visiblePosts);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @property --dot-progress {
            syntax: '<percentage>';
            inherits: false;
            initial-value: 0%;
          }
          `,
        }}
      />
      <ul class="carousel col-span-full gap-3 z-10 absolute bottom-[-180px] left-2/4">
        {Array.from({ length: numOfDots }).map((_, index) => (
          <li class="carousel-item" key={index}>
            <Slider.Dot index={index}>
              <div class="py-5">
                <div
                  class="w-2 h-2 rounded-full group-disabled:bg-[#D72228] dot group-enabled:bg-gray-500"
                  style={{ animationDuration: `${interval}s` }}
                />
              </div>
            </Slider.Dot>
          </li>
        ))}
      </ul>
    </>
  );
}

function Buttons() {
  return (
    <div class="flex gap-4 w-full justify-between">
      <div class="flex items-center justify-center z-10 col-start-3 row-start-2">
        <Slider.PrevButton class="flex items-center justify-center btn-square border border-[#B91C1C] relative left-[-8px] h-8 w-8">
          <Icon
            class="text-[#B91C1C]"
            size={24}
            id="ChevronLeft"
            strokeWidth={3}
          />
        </Slider.PrevButton>
      </div>
      <div class="flex items-center justify-center z-10 col-start-1 row-start-2">
        <Slider.NextButton class="flex items-center justify-center btn-square border border-[#B91C1C] absolute right-[-8px] w-8 h-8">
          <Icon
            class="text-[#B91C1C]"
            size={24}
            id="ChevronRight"
            strokeWidth={3}
          />
        </Slider.NextButton>
      </div>
    </div>
  );
}

function Carousel(props: Props) {
  const id = useId();
  const { posts, interval } = props;

  return (
    <div
      id={id}
      class="min-h-min relative flex flex-col container lg:mx-auto mx-4 py-12 lg:py-28"
    >
      <Slider
        class="carousel carousel-center w-full col-span-full row-span-full gap-6 "
        rootId={id}
        interval={interval && interval * 1e3}
        infinite
      >
        {posts?.map((post, index) => (
          <Slider.Item
            index={index}
            class="carousel-item lg:w-1/4 w-[45%]"
            key={index}
          >
            <SliderItem
              post={post}
              id={`${id}::${index}`}
            />
          </Slider.Item>
        ))}
      </Slider>

      <div class="flex justify-between absolute top-2/4 w-full">
        {props.dots && <Dots posts={posts} interval={interval} />}{" "}
        {props.arrows && <Buttons />}
      </div>
    </div>
  );
}

export default Carousel;
