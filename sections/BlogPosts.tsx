import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { ComponentChildren, Fragment } from "preact";
import { BlogPost } from "apps/blog/types.ts";
import { useId } from "../sdk/useId.ts";
import { useSection as useSection } from "@deco/deco/hooks";
export interface CTA {
  text?: string;
}
/** @title {{{title}}} */
export interface Post {
  url?: string;
  title?: string;
  author?: string;
  excerpt?: string;
  image?: ImageWidget;
  date?: string;
  readingTime?: string;
  tags?: string[];
}
export interface Props {
  cta?: CTA;
  posts?: BlogPost[] | null;
  pagination?: {
    /**
     * @title First page
     * @description Leave it as 0 to start from the first page
     */
    page?: number;
    /** @title items per page */
    perPage?: number;
  };
}
function Container({ children }: {
  children: ComponentChildren;
}) {
  return (
    <div
      class="container lg:mx-auto mx-2  text-sm"
      id="tab-contents"
      role="tabpanel"
      hx-trigger="load"
    >
      <div class="space-y-8">
        {children}
      </div>
    </div>
  );
}
export default function BlogPostsHome(
  {
    cta = { text: "Show more" },
    posts,
    pagination: { page = 0, perPage = 6 } = {},
  }: Props,
) {
  const from = perPage * page;
  const to = perPage * (page + 1);
  // It's boring to generate ids. Let's autogen them
  const postList = useId();
  // Get the HTMX link for this section
  const fetchMoreLink = useSection({
    // Renders this section with the next page
    props: {
      pagination: { perPage, page: page + 1 },
    },
  });
  // function calculateReadingTime(words: number): string {
  //   const wordsPerMinute = 250;
  //   const estimatedTimeMinutes = words / wordsPerMinute;
  //   const roundedReadingTime = Math.round(estimatedTimeMinutes);
  //   return `${roundedReadingTime} min`;
  // }
  const ContainerComponent = page === 0 ? Container : Fragment;
  return (
    <ContainerComponent>
      <>
        <div class="gap-8 grid grid-cols-1">
          {posts?.slice(from, to).map((post) => (
            <a
              href={`/blog/${post.slug}`}
              class="border border-secondary flex flex-row overflow-hidden "
            >
              <Image
                width={399}
                height={208}
                class="object-fit w-[30%]"
                sizes="(max-width: 640px) 100vw, 30vw"
                src={post.image || ""}
                alt={post.image}
                decoding="async"
                loading="lazy"
              />
              <div class="p-6 space-y-4 w-[70%] bg-white">
                {
                  /* <div class="font-semibold hidden">
                  {calculateReadingTime(post.content.split(" ").length)}
                </div> */
                }
                <div class="flex flex-wrap gap-2">
                  {post.categories && (
                    <div class="flex flex-wrap  !my-0 gap-2">
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
                </div>
                <div class="space-y-2">
                  <h3 class="text-[18px] text-primary font-bold uppercase">
                    {post.title}
                  </h3>
                  <p class="text-sm text-primary">{post.excerpt}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="text-primary font-bold">
                    {post.date
                      ? new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                      : ""}
                  </span>
                  {/* <span>•</span> */}
                  <span>{post.authors[0]?.name}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {posts && to <= posts.length && (
          <div class="flex justify-center w-full" id={postList}>
            <button
              hx-get={fetchMoreLink}
              hx-swap="outerHTML"
              hx-target={`#${postList}`}
              aria-label={cta.text}
              class="bg-primary max-w-[427px] btn-load-more w-full rounded-none relative max-h-[40px] h-[40px]"
            >
              <span class="inline [.htmx-request_&]:hidden uppercase text-white">
                {cta.text}
              </span>
              <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              <svg
                width="15"
                height="48"
                viewBox="0 0 15 48"
                className="absolute right-[-15px] top-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0H15V29.0909L0 40V0Z" fill="#031D41" />
              </svg>
            </button>
          </div>
        )}
      </>
    </ContainerComponent>
  );
}
