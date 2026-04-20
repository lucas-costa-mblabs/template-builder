import type { CVDTemplate } from "../types";

export const activationDiscountTemplate: CVDTemplate = {
  id: "template-1774286543836",
  title: "Ativação Desconto",
  active: true,
  slug: "cvd:content_type=1:discount_type=1:promotion_type=4",
  template: [
    {
      id: "rvnm6q2id",
      type: "container",
      blocks: [
        {
          id: "r8yfd5q46",
          type: "avatar",
          url: "{{post.profile.iconUrl}}",
          icon: "shoppingbag",
          size: 20,
          backgroundColor: "gray-100",
          borderRadius: "full"
        },
        {
          id: "8ck3l1t4d",
          type: "text",
          value: "{{post.profile.accountName}}",
          typography: "heading5",
          color: "gray-900",
          fontWeight: "semiBold"
        }
      ],
      direction: "row",
      paddingX: "md",
      paddingY: "sm",
      alignItems: "center",
      gap: "sm"
    },
    {
      id: "6n1cziyz5",
      type: "divider",
      thickness: "thin"
    },
    {
      id: "w0sibv6hq",
      type: "container",
      blocks: [
        {
          id: "qqhmjaefb",
          type: "media",
          url: "{{post.url}}",
          alt: "Mídia",
          width: "100%",
          height: "",
          objectFit: "contain"
        }
      ],
      direction: "column",
      paddingX: "md",
      height: "100%"
    },
    {
      id: "6sz45x7tl",
      type: "divider"
    },
    {
      id: "7mvrkp9k3",
      type: "post_interactions",
      showLike: true,
      showSave: true,
      showShare: true,
      paddingX: "md",
      paddingY: "xs"
    },
    {
      id: "tljn2usvt",
      type: "container",
      blocks: [
        {
          id: "jz27jbdtn",
          type: "text",
          value: "{{post.title}}",
          typography: "heading5",
          color: "gray-900",
          fontWeight: "normal"
        }
      ],
      direction: "column",
      paddingX: "md",
      paddingY: "xs"
    },
    {
      id: "elr6q26ey",
      type: "price",
      price: "{{post.price}}",
      originalPrice: "{{post.originalPrice}}",
      discountPercent: "{{post.discount}}",
      showOriginalPrice: true,
      showDiscountPercent: true,
      paddingX: "md"
    },
    {
      id: "pbwqas01z",
      type: "container",
      blocks: [
        {
          id: "v8qnki773",
          type: "button",
          label: "Ativar desconto",
          variant: "primary",
          radius: "md",
          action: {
            type: "DEEPLINK",
            payload: {
              deeplink: "directoai://produto?sku=ABC123&action=ativar_desconto",
            },
          },
        },
        {
          id: "2j6hz3slm",
          type: "button",
          label: "Conhecer mais",
          variant: "ghost",
          radius: "md",
          action: {
            type: "DEEPLINK",
            payload: {
              deeplink: "directoai://produto?sku=ABC123&action=conhecer_mais",
            },
          },
        }
      ],
      direction: "column",
      paddingX: "md",
      justifyContent: "center",
      gap: "sm",
      paddingY: "sm"
    }
  ]
};
