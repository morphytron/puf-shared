export type ProductAndPrices = {
    product: Product;
    prices: Price[];
    descriptorList?: string[];
};
export type PriceMeta = {
    quantity: number;
    priceId : string;
    isSubscription: boolean;
};
export type Product = {
    id: string;
    active: boolean;
    attributes: any[];
    created: number; //a date
    defaultPrice: string; //a key
    description: string;
    images: any[];
    livemode: boolean;
    metadata: ProductMetaData;
    name: string;
    object: 'product';
    type: string;
    updated: number; // a date
}

export type Price = {
    id : string;
    active: boolean;
    billing_scheme: string;
    created: number;
    currency: string;
    nickname: string;
    type: 'one_time' | 'recurring';
    unitAmount: number;
    unitAmountDecimal: number;
    taxBehavior: string;
    recurring?: {
        interval: string;
        intervalCount: number;
        usageType: string;
    }
};
export type Plan = {
	id : string;
	deleted: boolean;
	created: number;
	price: Price;
	quantity: number;
	product: Product;
}

export type StripeSubscriptionItem = {
	created: number;
	deleted : boolean;
	id: string;
	price: Price;
	plan: Plan;
	subscription: string;
};

export type StripeSubscription = {
	id : string;
	applicationFeePercent : string; // big decimal
	cancelAt : number // unix epoc date in the future it will be cancelled
	cancellationDetails : {
		comment: string;
		feedback: string;
		reason: string;
	};
	created : number // unix epoc date when it was created.
	currency : string; //3 letter currency code
	daysUntilDue : number ;
	items: StripeSubscriptionItem[];
};
export type PaymentMethod = {
    id : string;
    object: 'billing_details';
    billingDetails: {
        address: {
            country: string;
            postalCode?: string;
        }
        email: string;
        name: string;
    };
    card?: {
        brand: string; // visa, mastercard etc.
        checks: {
            cvc_check : string;
        }
        country : string; // 2-3 letters
        expMonth: number;
        expYear: number;
        fingerprint: string;
        funding: string // could be 'credit'
        generatedFrom : any;
        last4: string;
        networks: {
            available: string[]; //matches with brand
        }
        threeDSecureUsage: {
            supported: boolean;
        }
        wallet: any;
    };
    usBankAccount?: {
        accountHolderType: 'company' | 'individual';
        accountType: 'checking' | 'savings';
        bankName: string;
        statusDetails: {
            blocked?: any;
        }
    };
    created: number;
    customer: any;
    livemode: boolean;
    metadata: {} & any;
    type: string;
};

export type ProductAndPrice = Price & Product & {
    price_id: string;
    price_type: string;
};

export type ProductMetaData = {
    tier? : string;
}