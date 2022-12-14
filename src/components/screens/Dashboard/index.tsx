import React, {useCallback, useEffect, useState} from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../TransactionCard';


import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}

interface HighLightData {
    entries: HighlightProps;
    expenses: HighlightProps;
    total: HighlightProps;
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData);

    const theme = useTheme();

    async function loadTransactions(){
        const datakey = '@gofinance:transactions';
        const response = await AsyncStorage.getItem(datakey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensesTotal = 0;


        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            }else {
                expensesTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        
        const date = Intl.DateTimeFormat('pt-BR', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit'
        }).format(new Date(item.date));

        return {
            id: item.id,
            name: item.name,
            amount,
            type: item.type,
            category: item.category,
            date,
        }

    });

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = Math.max.apply(Math, transactions
    .filter((transaction: DataListProps) => transaction.type === 'positive')
    .map((transaction: DataListProps) => new Date(transaction.date).getTime()));

    // console.log(new Date(lastTransactionEntries));

    const total = entriesTotal - expensesTotal;

    setHighLightData({
        entries: {
            amount: entriesTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
        },
        expenses: {
            amount: expensesTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
        },
        total: {
            amount: total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
        }
    });

    setIsLoading(false);
    }

useEffect(() => {
    loadTransactions();
},[]);

useFocusEffect(useCallback(() => {
    loadTransactions()
    // const datakey = '@gofinance:transactions';
    // AsyncStorage.removeItem(datakey);
},[]));

    return(
    <Container>
        { isLoading ? 
        <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer> :
    <>
        <Header>
            <UserWrapper>
                <UserInfo>
                    <Photo 
                    source={{ uri: 'https://github.com/brauliolozano.png'}}
                    />
                    <User>
                        <UserGreeting>Ol??,</UserGreeting>
                        <UserName>Braulio</UserName>
                    </User>
                </UserInfo>
                <LogoutButton onPress={() => {}}> 
                    <Icon name="power"/>
                </LogoutButton>
            </UserWrapper>
        
        </Header>
            <HighlightCards>
                <HighlightCard 
                type="up"
                title="Entradas" 
                amount={highLightData.entries.amount}
                lastTransaction="??ltima entrada dia 13 de agosto" 
                />
                <HighlightCard 
                type="down"
                title="Sa??das" 
                amount={highLightData.expenses.amount}
                lastTransaction="??ltima sa??da dia 17 de agosto"
                />
                <HighlightCard 
                type="total"
                title="Total" 
                amount={highLightData.total.amount}
                lastTransaction="01 ?? 17 de agosto"
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

            <TransactionList
                    data={transactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>
        </>
    }
    </Container>
    )
}