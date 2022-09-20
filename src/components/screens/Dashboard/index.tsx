import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    LogoutButton
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard(){
    const [data, setData] = useState<DataListProps[]>([]);

    async function loadTransactions(){
        const datakey = '@gofinance:transactions';
        const response = await AsyncStorage.getItem(datakey);
        const transactions = response ? JSON.parse(response) : [];

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
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

    setData(transactionsFormatted);
    
    }

useEffect(() => {
    loadTransactions();
},[]);

    return(
<Container>
    <Header>
        <UserWrapper>
            <UserInfo>
                <Photo 
                source={{ uri: 'https://github.com/brauliolozano.png'}}
                />
                <User>
                    <UserGreeting>Olá,</UserGreeting>
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
            title="Entradas" 
            amount="R$ 17.400,00" 
            lastTransaction="Última entrada dia 13 de agosto" 
            type="up"
            />
            <HighlightCard 
            title="Saídas" 
            amount="R$ 1.259,00" 
            lastTransaction="Última saída dia 17 de agosto"
            type="down"
            />
            <HighlightCard 
            title="Total" 
            amount="R$ 16.141,00" 
            lastTransaction="01 à 17 de agosto"
            type="total"
            />
        </HighlightCards>

        <Transactions>
            <Title>Listagem</Title>

           <TransactionList
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
            />

            
        </Transactions>
    </Container>
    )
}