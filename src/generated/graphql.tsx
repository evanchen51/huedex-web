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
};

export type LangTable = {
  __typename?: 'LangTable';
  code: Scalars['String'];
  createdAt: Scalars['String'];
  englishName: Scalars['String'];
  id: Scalars['Float'];
  nativeName: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type MediaTable = {
  __typename?: 'MediaTable';
  class: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  info: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  logout: Scalars['Boolean'];
};

export type Option = {
  __typename?: 'Option';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  mediaTypeId?: Maybe<Scalars['Int']>;
  mediaUrl?: Maybe<Scalars['String']>;
  numOfVotes: Scalars['Float'];
  optionText: OptionText;
  updatedAt: Scalars['String'];
  votes: Vote;
};

export type OptionText = {
  __typename?: 'OptionText';
  createdAt: Scalars['String'];
  langId: Scalars['Float'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Poll = {
  __typename?: 'Poll';
  anonymousId?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  mediaTypeId?: Maybe<Scalars['Int']>;
  mediaUrl?: Maybe<Scalars['String']>;
  nsfw: Scalars['Boolean'];
  numOfVotes: Scalars['Float'];
  options: Option;
  pollText: PollText;
  poster?: Maybe<User>;
  updatedAt: Scalars['String'];
  votes: Vote;
};

export type PollText = {
  __typename?: 'PollText';
  createdAt: Scalars['String'];
  langId: Scalars['Float'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCurrentUser?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  polls: Poll;
  updatedAt: Scalars['String'];
  userLangPref: UserLangPref;
  votes: Vote;
};

export type UserLangPref = {
  __typename?: 'UserLangPref';
  createdAt: Scalars['String'];
  langId: Scalars['Float'];
  updatedAt: Scalars['String'];
};

export type Vote = {
  __typename?: 'Vote';
  anonymousId?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  option: Option;
  poll: Poll;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id: number } | null | undefined };


export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    id
  }
}
    `;

export function useGetCurrentUserQuery(options: Omit<Urql.UseQueryArgs<GetCurrentUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetCurrentUserQuery>({ query: GetCurrentUserDocument, ...options });
};