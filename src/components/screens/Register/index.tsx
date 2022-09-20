import React, {useState} from "react";
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert
} from "react-native";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import { InputForm } from "../../Forms/InputForm";
import { Button } from "../../Forms/Button";
import { TransactionTypeButton } from "../../Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../Forms/Button/CategorySelectButton";

import { CategorySelect } from "../CategorySelect";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório'),
    amount: Yup
    .number()
    .typeError('Somente números') 
    .positive('Somente > zero')
});

export function Register(){
    
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    
    const [category, setCategory] = useState({
           key: 'category',
           name: 'Categoria'
    });

    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTTSelect(type: 'up' | 'down'){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);  
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);  
    }

    async function handleRegister(form: FormData){
        if(!transactionType)
        return Alert.alert('Qual o tipo da transação?');

        if(category.key === 'category')
        return Alert.alert('Qual a categoria?');


        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
            date: new Date()
        }

        try{
            const datakey = '@gofinance:transactions';
            
            const data = await AsyncStorage.getItem(datakey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData, 
                newTransaction
            ];
            
            await AsyncStorage.setItem(datakey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            navigation.navigate('Listagem');

        }   catch (error) {
                console.log(error);
                Alert.alert("Não foi possível cadastrar");
        }
    }

    // useEffect(() => {
    //    async function loadData(){
    //     const data = await AsyncStorage.getItem(datakey);
    //     console.log(JSON.parse(data!));
    //    }
    //    /*  This is how we remove data from local device
    //    assync function removeAll(){await AsyncStorage.removeItem(datakey); }
    //     removeAll()
    //    */
    //    loadData();
    // },[]);
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>
        <Form>
        <Fields>
            <InputForm
                name="name"
                control={control}
                placeholder="Nome"
                autoCapitalize="sentences"
                autoCorrect={false}
                error={errors.name && errors.name.message}
            />
            <InputForm
                name="amount"
                control={control}
                placeholder="Preço"
                keyboardType="numeric"
                error={errors.amount && errors.amount.message}
            />
        <TransactionsTypes>
            <TransactionTypeButton 
                type="up"
                title="Income"
                onPress={() => handleTTSelect('up')}
                isActive={transactionType === 'up'}
                />
             <TransactionTypeButton 
                type="down"
                title="Outcome"
                onPress={() => handleTTSelect('down')}
                isActive={transactionType === 'down'}
                />    
        </TransactionsTypes>

        <CategorySelectButton 
        title={category.name}
        onPress={handleOpenSelectCategoryModal}
        />
        </Fields>

        <Button 
            title="Enviar" 
            onPress={handleSubmit(handleRegister)}
        />
        </Form>

        <Modal visible={categoryModalOpen}>
            <CategorySelect
                category={category}
                setCategory={setCategory}
                closeSelectCategory={handleCloseSelectCategoryModal}
           />
        </Modal>
        </Container>
        </TouchableWithoutFeedback>
    );
}