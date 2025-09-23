/* eslint-disable import/no-default-export */
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationPages } from "@/components/ui/pagination";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive pagination component with previous/next navigation, numbered pages, and ellipsis gaps for large datasets. Uses `PaginationPrevious`, `PaginationNext`, `PaginationPage`, and `PaginationGap` components to create a full navigation experience.",
      },
    },
  },
  render: () => {
    return (
      <Pagination count={100} defaultPageSize={10}>
        <Button variant="outline" aria-label="Previous page">
          <CaretLeftIcon />
        </Button>
        <PaginationPages />
        <Button variant="outline" aria-label="Next Page">
          <CaretRightIcon />
        </Button>
      </Pagination>
    );
  },
};

// export const FirstPage: Story = {
//   parameters: {
//     docs: {
//       description: {
//         story:
//           "When users are on the first page, the `PaginationPrevious` button should be disabled by passing `href=null`. This provides clear visual feedback that there are no previous pages available and prevents navigation errors.",
//       },
//     },
//   },
//   render: () => {
//     return (
//       <div className="flex justify-center">
//         <Pagination>
//           <PaginationPrevious href={null} />
//           <PaginationList>
//             <PaginationPage current href=".">
//               1
//             </PaginationPage>
//             <PaginationPage href=".">2</PaginationPage>
//             <PaginationPage href=".">3</PaginationPage>
//             <PaginationPage href=".">4</PaginationPage>
//             <PaginationGap />
//             <PaginationPage href=".">65</PaginationPage>
//             <PaginationPage href=".">66</PaginationPage>
//           </PaginationList>
//           <PaginationNext href="." />
//         </Pagination>
//       </div>
//     );
//   },
// };

// export const LastPage: Story = {
//   parameters: {
//     docs: {
//       description: {
//         story:
//           "When users reach the final page, disable the `PaginationNext` button by setting `href=null`. This prevents users from attempting to navigate beyond the available content and maintains a consistent disabled state styling across the interface.",
//       },
//     },
//   },
//   render: () => {
//     return (
//       <div className="flex justify-center">
//         <Pagination>
//           <PaginationPrevious href="." />
//           <PaginationList>
//             <PaginationPage href=".">1</PaginationPage>
//             <PaginationPage href=".">2</PaginationPage>
//             <PaginationGap />
//             <PaginationPage href=".">64</PaginationPage>
//             <PaginationPage href=".">65</PaginationPage>
//             <PaginationPage current href=".">
//               66
//             </PaginationPage>
//           </PaginationList>
//           <PaginationNext href={null} />
//         </Pagination>
//       </div>
//     );
//   },
// };

// export const SimpleNavigation: Story = {
//   parameters: {
//     docs: {
//       description: {
//         story:
//           "For minimal interfaces or mobile-first designs, use only `PaginationPrevious` and `PaginationNext` without numbered pages. This reduces cognitive load and saves screen space while maintaining essential navigation functionality.",
//       },
//     },
//   },
//   render: () => {
//     return (
//       <div className="flex justify-center">
//         <Pagination>
//           <PaginationPrevious href="." />
//           <PaginationNext href="." />
//         </Pagination>
//       </div>
//     );
//   },
// };

// export const SinglePage: Story = {
//   parameters: {
//     docs: {
//       description: {
//         story:
//           "When there's only one page of content, both navigation buttons should be disabled to indicate no pagination is needed. This prevents user confusion and unnecessary navigation attempts while maintaining interface consistency.",
//       },
//     },
//   },
//   render: () => {
//     return (
//       <div className="flex justify-center">
//         <Pagination>
//           <PaginationPrevious href={null} />
//           <PaginationList>
//             <PaginationPage current href=".">
//               1
//             </PaginationPage>
//           </PaginationList>
//           <PaginationNext href={null} />
//         </Pagination>
//       </div>
//     );
//   },
// };

// export const WithoutGaps: Story = {
//   parameters: {
//     docs: {
//       description: {
//         story:
//           "For smaller datasets or when all pages can be displayed without overwhelming the interface, show all page numbers without `PaginationGap` components. This provides direct access to every page and works well for datasets with 10 or fewer pages.",
//       },
//     },
//   },
//   render: () => {
//     return (
//       <div className="flex justify-center">
//         <Pagination>
//           <PaginationPrevious href="." />
//           <PaginationList>
//             <PaginationPage href=".">1</PaginationPage>
//             <PaginationPage href=".">2</PaginationPage>
//             <PaginationPage current href=".">
//               3
//             </PaginationPage>
//             <PaginationPage href=".">4</PaginationPage>
//             <PaginationPage href=".">5</PaginationPage>
//             <PaginationPage href=".">6</PaginationPage>
//             <PaginationPage href=".">7</PaginationPage>
//           </PaginationList>
//           <PaginationNext href="." />
//         </Pagination>
//       </div>
//     );
//   },
// };

// export const BasicPaginationComponent: Story = {
//   parameters: {
//     docs: {
//       description: {
//         story:
//           "The `BasicPagination` component uses Zag.js state machine for intelligent pagination logic. It automatically calculates page ranges, handles edge cases, and integrates with TanStack Router for URL-based pagination state. Pass a `count` prop to enable automatic page calculation. This component automatically syncs pagination state with the URL through TanStack Router's `useSearch` and `useNavigate` hooks. Page changes update the URL's search parameters, enabling bookmarkable pagination states and proper browser back/forward navigation.",
//       },
//     },
//   },
//   render: () => {
//     return (
//       <div className="flex justify-center">
//         <BasicPagination count={1250} />
//       </div>
//     );
//   },
// };
