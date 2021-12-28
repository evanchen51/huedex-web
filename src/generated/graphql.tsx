import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type CreatePollInput = {
  anonymous?: InputMaybe<Scalars['Boolean']>;
  langId: Scalars['Float'];
  newTags: Array<Scalars['String']>;
  optionTexts: Array<Scalars['String']>;
  tagIds: Array<Scalars['Float']>;
  text: Scalars['String'];
};

export type LangPref = {
  __typename?: 'LangPref';
  langId: Array<Scalars['Int']>;
};

export type LangTable = {
  __typename?: 'LangTable';
  code: Scalars['String'];
  englishName: Scalars['String'];
  id: Scalars['Float'];
  nativeName: Scalars['String'];
};

export type MediaTable = {
  __typename?: 'MediaTable';
  class: Scalars['String'];
  id: Scalars['Float'];
  info: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPoll: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  setUserDisplayName: User;
  setUserLangPref: LangPref;
};


export type MutationCreatePollArgs = {
  createPollInput: CreatePollInput;
};


export type MutationSetUserDisplayNameArgs = {
  displayName: Scalars['String'];
};


export type MutationSetUserLangPrefArgs = {
  newLangPref: Array<Scalars['Int']>;
};

export type Option = {
  __typename?: 'Option';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  mediaTypeId?: Maybe<Scalars['Int']>;
  mediaUrl?: Maybe<Scalars['String']>;
  numOfVotes: Scalars['Float'];
  optionText: Array<OptionText>;
  pollId: Scalars['Float'];
  updatedAt: Scalars['String'];
  votes: Array<Vote>;
};

export type OptionClientFullView = {
  __typename?: 'OptionClientFullView';
  numOfVotes: Scalars['Float'];
  optionId: Scalars['Float'];
  pollId: Scalars['Float'];
  text: Text;
};

export type OptionText = {
  __typename?: 'OptionText';
  createdAt: Scalars['String'];
  langId: Scalars['Float'];
  optionId: Scalars['Float'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Poll = {
  __typename?: 'Poll';
  anonymousPoster?: Maybe<User>;
  anonymousPosterId?: Maybe<Scalars['Int']>;
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  mediaTypeId?: Maybe<Scalars['Int']>;
  mediaUrl?: Maybe<Scalars['String']>;
  nsfw: Scalars['Boolean'];
  numOfVotes: Scalars['Float'];
  options: Array<Option>;
  pollText: Array<PollText>;
  poster?: Maybe<User>;
  posterId?: Maybe<Scalars['Int']>;
  tags: Array<PollTag>;
  updatedAt: Scalars['String'];
  votes: Array<Vote>;
};

export type PollClientFullView = {
  __typename?: 'PollClientFullView';
  createdAt: Scalars['DateTime'];
  numOfVotes: Scalars['Float'];
  options: Array<OptionClientFullView>;
  pollId: Scalars['Float'];
  posterDisplayName?: Maybe<Scalars['String']>;
  posterId?: Maybe<Scalars['Int']>;
  text: Text;
};

export type PollTag = {
  __typename?: 'PollTag';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  poll: Poll;
  pollId: Scalars['Float'];
  tag: Tag;
  tagId: Scalars['Float'];
  updatedAt: Scalars['String'];
};

export type PollText = {
  __typename?: 'PollText';
  createdAt: Scalars['String'];
  langId: Scalars['Float'];
  pollId: Scalars['Float'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCurrentUser?: Maybe<User>;
  getCurrentUserAllLangPrefs: LangPref;
  getLangTable?: Maybe<Array<LangTable>>;
  getSinglePoll?: Maybe<PollClientFullView>;
  visitorFeed: Scalars['String'];
};


export type QueryGetSinglePollArgs = {
  id: Scalars['Int'];
  langId: Scalars['Int'];
};


export type QueryVisitorFeedArgs = {
  langId: Scalars['Int'];
};

export type Tag = {
  __typename?: 'Tag';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  polls: Array<PollTag>;
  tagText: Array<TagText>;
  updatedAt: Scalars['String'];
};

export type TagText = {
  __typename?: 'TagText';
  createdAt: Scalars['String'];
  langId: Scalars['Float'];
  tagId: Scalars['Float'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Text = {
  __typename?: 'Text';
  langId: Scalars['Float'];
  originalLangId: Scalars['Float'];
  originalText: Scalars['String'];
  text?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  allLangPrefs: Array<UserLangPref>;
  anonymousPolls: Array<Poll>;
  anonymousVotes: Array<Vote>;
  createdAt: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  polls: Array<Poll>;
  primaryLangPref?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['String'];
  votes: Array<Vote>;
};

export type UserLangPref = {
  __typename?: 'UserLangPref';
  langId: Scalars['Float'];
  userId: Scalars['Float'];
};

export type Vote = {
  __typename?: 'Vote';
  anonymousVoter?: Maybe<User>;
  anonymousVoterId?: Maybe<Scalars['Int']>;
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  option: Option;
  optionId: Scalars['Float'];
  poll: Poll;
  pollId: Scalars['Float'];
  updatedAt: Scalars['String'];
  voter?: Maybe<User>;
  voterId?: Maybe<Scalars['Int']>;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type SetUserDisplayNameMutationVariables = Exact<{
  displayName: Scalars['String'];
}>;


export type SetUserDisplayNameMutation = { __typename?: 'Mutation', setUserDisplayName: { __typename?: 'User', id: number, displayName?: string | null | undefined } };

export type SetUserLangPrefMutationVariables = Exact<{
  newLangPref: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type SetUserLangPrefMutation = { __typename?: 'Mutation', setUserLangPref: { __typename?: 'LangPref', langId: Array<number> } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id: number, displayName?: string | null | undefined, primaryLangPref?: number | null | undefined } | null | undefined };

export type GetCurrentUserAllLangPrefsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserAllLangPrefsQuery = { __typename?: 'Query', getCurrentUserAllLangPrefs: { __typename?: 'LangPref', langId: Array<number> } };

export type GetLangTableQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLangTableQuery = { __typename?: 'Query', getLangTable?: Array<{ __typename?: 'LangTable', id: number, code: string, nativeName: string, englishName: string }> | null | undefined };

export type GetSinglePollQueryVariables = Exact<{
  id: Scalars['Int'];
  langId: Scalars['Int'];
}>;


export type GetSinglePollQuery = { __typename?: 'Query', getSinglePoll?: { __typename?: 'PollClientFullView', pollId: number, posterId?: number | null | undefined, posterDisplayName?: string | null | undefined, numOfVotes: number, createdAt: any, text: { __typename?: 'Text', text?: string | null | undefined, langId: number, originalText: string, originalLangId: number }, options: Array<{ __typename?: 'OptionClientFullView', optionId: number, pollId: number, numOfVotes: number, text: { __typename?: 'Text', text?: string | null | undefined, langId: number, originalText: string, originalLangId: number } }> } | null | undefined };


export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const SetUserDisplayNameDocument = gql`
    mutation SetUserDisplayName($displayName: String!) {
  setUserDisplayName(displayName: $displayName) {
    id
    displayName
  }
}
    `;

export function useSetUserDisplayNameMutation() {
  return Urql.useMutation<SetUserDisplayNameMutation, SetUserDisplayNameMutationVariables>(SetUserDisplayNameDocument);
};
export const SetUserLangPrefDocument = gql`
    mutation SetUserLangPref($newLangPref: [Int!]!) {
  setUserLangPref(newLangPref: $newLangPref) {
    langId
  }
}
    `;

export function useSetUserLangPrefMutation() {
  return Urql.useMutation<SetUserLangPrefMutation, SetUserLangPrefMutationVariables>(SetUserLangPrefDocument);
};
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    id
    displayName
    primaryLangPref
  }
}
    `;

export function useGetCurrentUserQuery(options: Omit<Urql.UseQueryArgs<GetCurrentUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetCurrentUserQuery>({ query: GetCurrentUserDocument, ...options });
};
export const GetCurrentUserAllLangPrefsDocument = gql`
    query GetCurrentUserAllLangPrefs {
  getCurrentUserAllLangPrefs {
    langId
  }
}
    `;

export function useGetCurrentUserAllLangPrefsQuery(options: Omit<Urql.UseQueryArgs<GetCurrentUserAllLangPrefsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetCurrentUserAllLangPrefsQuery>({ query: GetCurrentUserAllLangPrefsDocument, ...options });
};
export const GetLangTableDocument = gql`
    query GetLangTable {
  getLangTable {
    id
    code
    nativeName
    englishName
  }
}
    `;

export function useGetLangTableQuery(options: Omit<Urql.UseQueryArgs<GetLangTableQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetLangTableQuery>({ query: GetLangTableDocument, ...options });
};
export const GetSinglePollDocument = gql`
    query GetSinglePoll($id: Int!, $langId: Int!) {
  getSinglePoll(id: $id, langId: $langId) {
    pollId
    text {
      text
      langId
      originalText
      originalLangId
    }
    options {
      optionId
      pollId
      text {
        text
        langId
        originalText
        originalLangId
      }
      numOfVotes
    }
    posterId
    posterDisplayName
    numOfVotes
    createdAt
  }
}
    `;

export function useGetSinglePollQuery(options: Omit<Urql.UseQueryArgs<GetSinglePollQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSinglePollQuery>({ query: GetSinglePollDocument, ...options });
};